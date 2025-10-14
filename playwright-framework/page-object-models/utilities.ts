import { AddLocationDataType } from '../data/citrinee.data'
import { faker } from '@faker-js/faker';
import * as crypto from 'crypto'





/**
 * Library of functions for the E-Commerece Applicaiton.
 *
 */

export class Utilities {

    async generateRandomEmail(): Promise<string> {
        const username = crypto.randomBytes(4).toString('hex') // You can adjust the length as needed
        const domain = crypto.randomBytes(3).toString('hex') + '.com' // You can change the domain as needed
      
        return username + '@' + domain
    }

    async generateRandomString(length: number): Promise<string> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let result = ''
      
        for (let i = 0; i < length; i++) {
            const randomIndex =await Math.floor(Math.random() * characters.length)
            result += await characters.charAt(randomIndex)
        }
      
        return await result
    }

    generateAddLocationData(): AddLocationDataType {
        return {
            name: faker.company.name(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            postalCode: faker.location.zipCode(),
            coordinates_latitude: faker.location.latitude({ min: -90, max: 90 }).toString(),
            coordinates_longitude: faker.location.longitude({ min: -180, max: 180 }).toString(),
        };
    }
}
