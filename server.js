const dotenv = require("dotenv");

const daraja = require('./model/daraja')

dotenv.config();

const express = require("express");

const cors = require("cors")

const colors = require("colors")

const unirest = require("unirest");

const DB = require('./configs/db')

const PORT = process.env.PORT || 3000;

// database connections
DB()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())

// let unirest = require('unirest');
// let req = unirest('GET', 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
// .headers({ 'Authorization': 'Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==' })
// .send()
// .end(res => {
//     if (res.error) throw new Error(res.error);
//     console.log(res.raw_body);
// });

const getAccesstoken = (req, res, next) => {
  const reqq = unirest(
    "GET",
    "https://sandbox.safaricom.co.ke/oauth/v1/generate"
  );

  const auth = new Buffer.from(
    "cQFp56FaeAOkuWCWA9YiPgA44FV2mRNl:auLkR58cglrStrEi"
  ).toString("base64");

  reqq.query({
    grant_type: "client_credentials",
  });

  reqq.headers({
    Authorization: "Basic " + auth,
  });

  reqq.end((response) => {
    if (response.error) throw new Error(response.error);
    data = response.body;

    // console.log(data.access_token)

    // res.json({
    //   data,
    // });

    req.access_token = data.access_token;

    next();
  });
};

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/access_token", getAccesstoken, (req, res) => {
  console.log(req.access_token, 1111);
  res.json({
    access_token: req.access_token,
  });
});

app.get("/register_urls", getAccesstoken, (req, res) => {
  const auth = req.access_token;

  // console.log(auth)
  const reqq = unirest(
    "POST",
    "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
  );

  // const auth = new Buffer(
  //   "cQFp56FaeAOkuWCWA9YiPgA44FV2mRNl:auLkR58cglrStrEi"
  // ).toString("base64");

  // reqq.query({
  //   grant_type: "client_credentials",
  // });

  reqq.headers({
    Authorization: "Bearer " + auth,
    "Content-Type": "application/json",
  });

  // console.log(process.env.ngrok, "amos")

  reqq.json({
    ShortCode: 600984,
    ResponseType: "Completed",
    ConfirmationURL: `${process.env.ngrok}confirmation`,
    ValidationURL: `${process.env.ngrok}validation`,
  });

  reqq.end((response) => {
    if (response.error) throw new Error(response.error);
    data = response.body;

    res.json({
      data,
    });
  });
});


app.post("/confirmation", (req, res) => {
  console.log("Confirmation");
  console.log(req);
});

app.post("/validation", (req, res) => {
  console.log("validatiom");
  console.log(req.body);
});

// let unirest = require('unirest');
// let req = unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl')
// .headers({
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer 5mThX30lplko9BKlKcU4s04pOGVt'
// })
// .send(JSON.stringify({
//     "ShortCode": 600977,
//     "ResponseType": "Completed",
//     "ConfirmationURL": "https://e1ce-102-219-208-58.in.ngrok.io/confirmation",
//     "ValidationURL": "https://e1ce-102-219-208-58.in.ngrok.io/validation",
//   }))
// .end(res => {
//     if (res.error) throw new Error(res.error);
//     console.log(res.raw_body);
// });

app.get("/simulate", getAccesstoken, (req, res) => {
  const auth = req.access_token;

  // const reqq = unirest(
  //   "POST",
  //   "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate"
  // );

  // reqq.headers({
  //   Authorization: "Bearer " + auth,
  // });

  // reqq.json({
  //   ShortCode: 600992,
  //   CommandID: "CustomerPayBillOnline",
  //   amount: "100",
  //   MSISDN: "254705912645",
  //   BillRefNumber: "600992",
  // });

  // reqq.end((response) => {
  //   console.log(response);
  //   if (response.error) throw new Error(response.error);
  //   data = response.body;

  //   res.json({
  //     data,
  //   });
  // });

  // let unirest = require("unirest");
  let reqq = unirest(
    "POST",
    "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate"
  )
    .headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth,
    })
    .send(
      JSON.stringify({
        ShortCode: 600992,
        CommandID: "CustomerPayBillOnline",
        Amount: 100,
        Msisdn: "254705912645",
        BillRefNumber: "600992",
      })
    )
    .end((response) => {
      // console.log(response, 'amosmoy')
      if (response.error) throw new Error(response.error);
      console.log(response.raw_body);

      data = response.raw_body;

      res.json({
        data,
      });
    });
});

app.get("/balance", getAccesstoken, (req, res) => {
  let auth = req.access_token;

  let reqq = unirest(
    "POST",
    "https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query"
  )
    .headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth,
    })
    .send(
      JSON.stringify({
        Initiator: "testapi",
        SecurityCredential:
          "HUOnyI/VsObb3x7y+QVmx2yKmqZkfihDMOtIgB8dY6EfPBk2j9CSYGNXJq5b2Oqpe5nLaRCLInsoCqgAgVlk8gWw52FBYLk92lDlvWIezoDRFNpOWy78mBRK5p/bhMf4NBDuGCFBtKmPexalFSuahcPsxSPXQa/F4ov9uT0NixtIUrK6IbWYnYOn4oPaODtqLzk/s6dN6GLj7MmJegduMkmRdHlEu9uVplOW9jZSbxhUBMUUie1o34b2r+KA7dAUiQTvn/TvdKkKuUyUI9FLxeyOLqnjki3kAWHQGPFjJ5v25ujcKpol9p6ESgs4zjxDNWF70rgr+k9nPuO/WzkAeQ==",
        CommandID: "AccountBalance",
        PartyA: 600995,
        IdentifierType: "4",
        Remarks: "Bank Balance",
        QueueTimeOutURL: "https://192.168.56.1/AccountBalance/queue/",
        ResultURL: "https://192.168.56.1/AccountBalance/result/",
      })
    )
    .end((response) => {
      console.log(response);
      if (response.error) throw new Error(response.error);
      console.log(response.raw_body);
      data = response.raw_body;

      res.json({
        data,
      });
    });
});

app.post("/mpesa/accountbalance/v1/query", (req, res) => {
  console.log(req);
});

app.post("/stk", getAccesstoken, (req, res) => {
  const phone = req.body.phone.substring(1);
  const amount = req.body.amount;
  let auth = req.access_token;

  let date = new Date();

  // const timestamp =
  //   date.getFullYear() +
  //   "" +
  //   "" +
  //   date.getMonth() +
  //   "" +
  //   "" +
  //   date.getDate() +
  //   "" +
  //   "" +
  //   date.getHours() +
  //   "" +
  //   "" +
  //   date.getMinutes() +
  //   "" +
  //   "" +
  //   date.getSeconds();

  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  const password = new Buffer.from(
    "174379" +
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
      timestamp
  ).toString("base64");

  let reqq = unirest(
    "POST",
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
  )
    .headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth,
    })
    .send(
      JSON.stringify({
        BusinessShortCode: "174379",
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: `254${phone}`,
        PartyB: "174379",
        PhoneNumber: `254${phone}`,
        CallBackURL: `${process.env.ngrok}path`,
        AccountReference: "Test",
        TransactionDesc: "Test",
      })
    )
    .end((response) => {

      if (response.error) throw new Error(response.error);

      data = response.raw_body;

      res.json({
        data,
      });
    });
});

app.post("/path", (req, res) => {
  let results = req.body.Body;

  // console.log(results.stkCallback, "amos");

  if(!req.body.Body.stkCallback.CallbackMetadata) {
    const output = results.stkCallback
    return res.json({
      output
    })
  }

  const phone  = results.stkCallback.CallbackMetadata.Item[4].Value;
  const amount = results.stkCallback.CallbackMetadata.Item[0].Value;
  const trnx_id = results.stkCallback.CallbackMetadata.Item[1].Value;

  try {
    const payment = new daraja()

    payment.number = phone;
    payment.trnx_id = trnx_id;
    payment.amount = amount;
  
    payment.save()

    return res.json({
      results
    })

  } catch (error) {
    return res.status({
      error
    })
  }


});

// let unirest = require('unirest');
// let req = unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')

// .headers({
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer cjSAZhEMGGqDVUNaQHGMutDEOnkk'
// })
// .send(JSON.stringify({
//     "BusinessShortCode": 174379,
//     "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjIxMTAxMTQxODQ4",
//     "Timestamp": "20221101141848",
//     "TransactionType": "CustomerPayBillOnline",
//     "Amount": 1,
//     "PartyA": 254768562861,
//     "PartyB": 174379,
//     "PhoneNumber": 254768562861,
//     "CallBackURL": "https://192.168.56.1/path",
//     "AccountReference": "Test",
//     "TransactionDesc": "Payment of X"
//   }))
// .end(res => {
//     if (res.error) throw new Error(res.error);
//     console.log(res.raw_body);
// });

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`.yellow.bold);
});

// let unirest = require('unirest');
// let req = unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl')
// .headers({
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer 13u0aJttJzn4MydyfNYUkI5Ne5T3'
// })
// .send(JSON.stringify({
//     "ShortCode": 600977,
//     "ResponseType": "Completed",
//     "ConfirmationURL": "https://192.168.56.1/confirmation",
//     "ValidationURL": "https://192.168.56.1/validation",
//   }))
// .end(res => {
//     if (res.error) throw new Error(res.error);
//     console.log(res.raw_body);
// });
