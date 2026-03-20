// split_models.js
import fs from 'fs';
import path from 'path';

const baseDir = './src/models';
const modules = {
    Awareness: [
        'awarenesscommunityposts', 'aidoctordiagnoses', 'awarenesspesticides', 'awarenessguides',
        'awarenessguidecategories', 'farmers', 'awarenesssocialcampaigns', 'awarenesssuccessstories',
        'awarenessbanners', 'awarenesstickers', 'awarenessvideos', 'awarenessimages',
        'awarenessaccounts', 'awarenesspoints'
    ],
    hire: [
        'jobs', 'jobposts', 'hireprofiles', 'hireusers', 'applications', 'resumes',
        'resumeeditors', 'resumeeditrequests', 'skills', 'categorys', 'automatchlogs',
        'creditsettings', 'plansettings', 'payments'
    ],
    wear: [
        'wearproducts', 'products', 'wearbuyers', 'customers', 'sellers', 'suppliers',
        'wearcarts', 'wishlists', 'authororders', 'customerorders', 'sellerwallets',
        'myshopwallets', 'wearauditlogs', 'wearlogs', 'wearbanners', 'wearoffercampaigns', 'wearotps', 'wearreviews', 'wearsearchhistories', 'wearsessions', 'wear_wishlists', 'wearnotifications'
    ],
    analytics: [
        'analytics', 'sessions', 'presences', 'events', 'streamevents', 'funnels', 'datalakes', 'predictions'
    ],
    core: [
        'admins', 'adminsettings', 'chatsupporttickets', 'loginattempts', 'tokenblacklists',
        'addresses', 'stripes', 'withdrowrequests', 'globalsettings', 'homecontents',
        'seller_customers', 'seller_customer_msgs', 'seller_admin_messages', 'staticcontents',
        'emailtemplates', 'locations', 'pages', 'otps', 'cardproducts', 'coupons'
    ]
};

// Create directories
Object.keys(modules).forEach(mod => {
    const dir = path.join(baseDir, mod);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Move files
const allFiles = fs.readdirSync(baseDir).filter(f => f.endsWith('.js') && f !== 'index.js');
allFiles.forEach(file => {
    const name = file.replace('.js', '');
    let found = false;
    for (const [mod, list] of Object.entries(modules)) {
        if (list.includes(name)) {
            fs.renameSync(path.join(baseDir, file), path.join(baseDir, mod, file));
            console.log(`Moved ${file} to ${mod}/`);
            found = true;
            break;
        }
    }
    if (!found) {
        // Move to core if not categorized
        const coreDir = path.join(baseDir, 'core');
        if (!fs.existsSync(coreDir)) fs.mkdirSync(coreDir);
        fs.renameSync(path.join(baseDir, file), path.join(baseDir, 'core', file));
        console.log(`Moved uncategorized ${file} to core/`);
    }
});
