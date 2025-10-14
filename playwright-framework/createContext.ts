import {chromium} from '@playwright/test'
import { HomePage } from './page-object-models/homePage'
import dotenv from 'dotenv';
dotenv.config();


async function contextSetup(): Promise<void> {

    const browser = await chromium.launch({
        args: ['--disable-web-security', '--ignore-certificate-errors'],
        headless: true
    })
    const context = await browser.newContext({
        ignoreHTTPSErrors: true,
        bypassCSP: true,
    })
    const page = await context.newPage()
    const homePage = new HomePage(page)

    const envUrl = process.env.VITE_URL!;

    try {
        await context.tracing.start({screenshots: true, snapshots: true})
        await page.goto(envUrl)
        await homePage.LoginAndNavigateToDashboard()
        await page.context().storageState({path: 'context/adminContext.json'})
        await context.tracing.stop({
            path: './test-results/create-context-trace.zip',
        })
        await browser.close()
    } catch (error) {
        await context.tracing.stop({
            path: './test-results/failed-create-context-trace.zip',
        })
        await browser.close()
        throw error
    }
}

export default contextSetup
