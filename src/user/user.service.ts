import { Injectable } from '@nestjs/common';
import { google, Auth } from 'googleapis';
import { PrismaService } from '../prisma/prisma.service';
import { createAccessToken, createRefreshToken, sendRefereshToken } from '../utils/authToken';
import { User } from './user.model';

@Injectable()
export class UserService {
    oauthClient: Auth.OAuth2Client;
    constructor(
        private readonly prisma: PrismaService
    ) {
        const clientID = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET

        this.oauthClient = new google.auth.OAuth2(
            clientID,
            clientSecret,
        );
    }

    async authenticate(token: string, res) {
        //token : you should get this access token from client side , then get profile data from it
        const tokenInfo = await this.oauthClient.verifyIdToken({ idToken: token });

        const email = tokenInfo.getPayload().email;

        try { //signIn level
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {            //signUp level
                return this.registerUser(token, email, res);
            }

            return this.handleRegisteredUser(user, res);
        } catch (error) {
            if (error.status !== 404) {
                throw new error;
            }
        }
    }

    async handleRegisteredUser(user: User, res) {
        const refreshToken = createRefreshToken(user.id, user.tokenVersion);
        const accessToken = createAccessToken(user.id, user.type);

        await sendRefereshToken(res, refreshToken);

        return {
            accessToken,
            refreshToken,
        };
    }

    async getUserData(token: string) {
        const tokenInfo = await this.oauthClient.verifyIdToken({ idToken: token });

        const payload = tokenInfo.getPayload()

        return payload
    }

    async registerUser(token: string, email: string, res) {
        const userData = await this.getUserData(token);

        const name = userData.name;
        const picture = userData.picture

        const user = await this.createWithGoogle(email, name, picture);

        return this.handleRegisteredUser(user, res);
    }

    async createWithGoogle(email: string, name: string, picture: string) {

        const user = await this.prisma.user.create({
            data: {
                name, email, picture
            }
        })

        return user;
    }

    async me(id: string): Promise<User> {
        return await this.prisma.user.findUnique({
            where: { id: id },
        }).catch((err) => { throw new Error("You are not logged in") });
    }


}