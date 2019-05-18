import * as SendGrid from '@sendgrid/mail';

export function send(){
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);

    SendGrid.send({
        
    },false).then().catch();
}