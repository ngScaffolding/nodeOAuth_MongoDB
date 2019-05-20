import * as SendGrid from '@sendgrid/mail';

export function send(to: string, from: string, subject: string, html: string){
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

    // SendGrid.send({length: 0}).then().catch();
}