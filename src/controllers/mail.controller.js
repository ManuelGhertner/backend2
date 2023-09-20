import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth:{
        user: "manuelghertner@gmail.com",
        pass: "mfxomsbkbifbxgzu" // pasarlo al .env
    },
    tls: {
        rejectUnauthorized: false // Omitir la verificación del certificado SSL
    }
})

export const mailing = async(req,res) =>{
    const result = await transport.sendMail({
        from: "Ecommerce <manuelghertner@gmail.com>",
        to: "manughertner@hotmail.com",
        subject: "Test",
        html: `
        <h1> Prueba </h1>
        <p> Parrafo de prueba </p>
        `,
        attachments: []
    })
    res.status(200).send({status: "Ok", result: result});
  }