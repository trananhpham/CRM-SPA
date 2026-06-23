const db = require('./db');

async function updateImages() {
    try {
        await db.query('UPDATE services SET image_url = "/services/basic_skincare_1782245474101.png" WHERE service_id = 1');
        await db.query('UPDATE services SET image_url = "/services/deep_skincare_1782245483175.png" WHERE service_id = 2');
        await db.query('UPDATE services SET image_url = "/services/body_massage_1782245493370.png" WHERE service_id = 3');
        await db.query('UPDATE services SET image_url = "/services/hair_removal_1782245502343.png" WHERE service_id = 4');
        await db.query('UPDATE services SET image_url = "/services/nuru_massage_1782245513567.png" WHERE service_id = 5');
        console.log('Images updated!');
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}

updateImages();
