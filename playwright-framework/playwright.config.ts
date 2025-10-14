import { PlaywrightTestConfig } from '@playwright/test'
import dotenv from 'dotenv';
dotenv.config();

const config: PlaywrightTestConfig = {
    expect: {
        timeout: 60 * 1000,
    },
    testDir: 'tests',
    testMatch: '*.spec.ts',
    reporter: [
        ['list'],
        ['html', {open: 'never'}]
    ],
    timeout: 1880 * 1000,
    reportSlowTests: null,
    snapshotPathTemplate: 'data/screenshots/{testFileDir}/{arg}{ext}',
    use: {
        baseURL: process.env.VITE_URL,
        browserName: 'chromium',
        headless: true,
        video: 'on',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        bypassCSP: true,
        launchOptions: {
            downloadsPath: 'test-results/downloads/',
            args: ['--disable-web-security', '--ignore-certificate-errors']
        },
        actionTimeout: 180 * 1000,
        navigationTimeout: 180 * 1000
    }
}
export default config
