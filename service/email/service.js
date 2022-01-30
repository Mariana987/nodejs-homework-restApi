import Mailgen from 'mailgen';
class EmailService {
    constructor(env, sender) {
        this.sender = sender
        switch (env) {
            case 'development':
                this.link = 'https://b527-91-226-196-88.ngrok.io'
                break
            case 'test':
                this.link = 'http://localhost:5000/'
                break
            case 'production':
                this.link = ' http://heroku/'
                break

            default:
                this.link = 'http://localhost:3000/'
        }
    }
    createEmailTemplate(userName, verifyToken) {
        const mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Group 35',
                link: this.link,
            }
        });
        const email = {
            body: {
                name: userName,
                intro: 'Welcome ! We\'re very excited to have you on board.',
                action: {
                    instructions: 'To get started with our API, please click here:',
                    button: {
                        color: '#22BC66',
                        text: 'Confirm your account',
                        link: `${this.link}/api/users/verify/${verifyToken}`,
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };
        return mailGenerator.generate(email);
    }
    async sendVerifyEmail(email, userName, verifyToken) {
        const emailBody = this.createEmailTemplate(userName, verifyToken)
        const msg = {
            to: email,
            subject: 'Verify email',
            html: emailBody,
        }
        try {
            const result = await this.sender.send(msg)
            console.log(result)
            return true
        } catch (error) {
            console.error(error.message)
            return false
        }
    }
};

export default EmailService