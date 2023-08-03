export const accountCreatedTempl = (name: string, url: string) => {
  return `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <link href="https://fonts.googleapis.com/css?family=Nunito+Sans&display=swap" rel="stylesheet">
      
          <style type="text/css">
              html,
              body {
                  font-family: 'Nunito Sans';
                  font-style: normal;
                  font-weight: 200;
              }
      
              .title {
                  font-size: 24px;
                  color: #1e293b;
              }
      
              body p {
                  margin: 3px 0;
              }
      
              span.otp {
                  color: #18aca1;
                  text-decoration: underline;
              }
      
              .chogm-logo {
                  height: 7rem;
              }
  
              .content {
                  padding: 2rem
              }
  
              .link {
                  font-weight: bold;
                  cursor: pointer;
                  padding-top: 1rem;
              }
          </style>
      
      </head>
      
      <body>
          <img class="chogm-logo" src="https://ci3.googleusercontent.com/proxy/rKoKsB21Xhzg159c9sL9kpa4_Y3uHlPmn0KaPvcX9mNajFtewa8y7F8vb80OjNlmmTHpmzhMU0-f4sPP8bD_De9vXcB_NOWQvYbb_YXY9rpF4hEPDeVbolVFF4RINKxeM_67cQ=s0-d-e1-ft#https://backend.chogm2022.rw/web/index.php?r=email-templates%2Fheader-image&id=88" />
              <div class="content">
                  <h4 class="title">Account created!</h4>
                  <p>Dear ${name},</p>
                  <p class="mail-body">Your CHOGM 2022 CMS account was created successfuly, This is to notify you that you can start using your account. </p>
                  <a class="link" href="${url}">click here to create new password</a>
              </div>
          </div>
      </body>
      
      </html>`;
};

export const verifyAccountTempl = (name: string, url: string) => {
  return `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <link href="https://fonts.googleapis.com/css?family=Nunito+Sans&display=swap" rel="stylesheet">
      
          <style type="text/css">
              html,
              body {
                  font-family: 'Nunito Sans';
                  font-style: normal;
                  font-weight: 200;
              }
      
              .title {
                  font-size: 24px;
                  color: #1e293b;
              }
      
              body p {
                  margin: 3px 0;
              }
      
              span.otp {
                  color: #18aca1;
                  text-decoration: underline;
              }
      
              .chogm-logo {
                  height: 7rem;
              }
  
              .content {
                  padding: 2rem
              }
  
              .link {
                  font-weight: bold;
                  cursor: pointer;
                  padding-top: 1rem;
                  color: #1e293b; !
              }
          </style>
      
      </head>
      
      <body>
          <img class="chogm-logo" src="https://ci3.googleusercontent.com/proxy/rKoKsB21Xhzg159c9sL9kpa4_Y3uHlPmn0KaPvcX9mNajFtewa8y7F8vb80OjNlmmTHpmzhMU0-f4sPP8bD_De9vXcB_NOWQvYbb_YXY9rpF4hEPDeVbolVFF4RINKxeM_67cQ=s0-d-e1-ft#https://backend.chogm2022.rw/web/index.php?r=email-templates%2Fheader-image&id=88" />
              <div class="content">
                  <h4 class="title">Password Reset</h4>
                  <p>Dear ${name},</p>
                  <p class="mail-body">To continue using Your CHOGM 2022 CMS account click on the link below to create another password.  </p>
                  <a class="link" href="${url}">click here to create new password</a>
              </div>
          </div>
      </body>
      
      </html>`;
};

export const bookingTempl = (name: string, title: string, message: string) => {
  return `<!DOCTYPE html>
          <html lang="en">
          
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="ie=edge">
              <link href="https://fonts.googleapis.com/css?family=Nunito+Sans&display=swap" rel="stylesheet">
          
              <style type="text/css">
                  html,
                  body {
                      font-family: 'Nunito Sans';
                      font-style: normal;
                      font-weight: 200;
                  }
          
                  .title {
                      font-size: 24px;
                      color: #1e293b;
                  }
          
                  body p {
                      margin: 3px 0;
                  }
          
                  span.otp {
                      color: #18aca1;
                      text-decoration: underline;
                  }
          
                  .chogm-logo {
                      height: 7rem;
                  }
      
                  .content {
                      padding: 2rem
                  }
      
                  .link {
                      font-weight: bold;
                      cursor: pointer;
                      padding-top: 1rem;
                  }

                  .thank-you {
                    font-weight: bold;
                    cursor: pointer;
                    padding-top: 1rem;
                }
              </style>
          
          </head>
          
          <body>
              <img class="chogm-logo" src="https://ci3.googleusercontent.com/proxy/rKoKsB21Xhzg159c9sL9kpa4_Y3uHlPmn0KaPvcX9mNajFtewa8y7F8vb80OjNlmmTHpmzhMU0-f4sPP8bD_De9vXcB_NOWQvYbb_YXY9rpF4hEPDeVbolVFF4RINKxeM_67cQ=s0-d-e1-ft#https://backend.chogm2022.rw/web/index.php?r=email-templates%2Fheader-image&id=88" />
                  <div class="content">
                      <h4 class="title">${title}</h4>
                      <p>Dear ${name},</p>
                      <p class="mail-body">${message}</p>
                      <br/>
                      <p class="thank-you">Thank you.</p>
                  </div>
              </div>
          </body>
          
          </html>`;
};

export const broadcastTempl = (title: string, message: string) => {
  return `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <link href="https://fonts.googleapis.com/css?family=Nunito+Sans&display=swap" rel="stylesheet">
            
                <style type="text/css">
                    html,
                    body {
                        font-family: 'Nunito Sans';
                        font-style: normal;
                        font-weight: 200;
                    }
            
                    .title {
                        font-size: 24px;
                        color: #1e293b;
                    }
            
                    body p {
                        margin: 3px 0;
                    }
            
                    span.otp {
                        color: #18aca1;
                        text-decoration: underline;
                    }
            
                    .chogm-logo {
                        height: 7rem;
                    }
        
                    .content {
                        padding: 2rem
                    }
        
                    .link {
                        font-weight: bold;
                        cursor: pointer;
                        padding-top: 1rem;
                    }
                </style>
            
            </head>
            
            <body>
                <img class="chogm-logo" src="https://ci3.googleusercontent.com/proxy/rKoKsB21Xhzg159c9sL9kpa4_Y3uHlPmn0KaPvcX9mNajFtewa8y7F8vb80OjNlmmTHpmzhMU0-f4sPP8bD_De9vXcB_NOWQvYbb_YXY9rpF4hEPDeVbolVFF4RINKxeM_67cQ=s0-d-e1-ft#https://backend.chogm2022.rw/web/index.php?r=email-templates%2Fheader-image&id=88" />
                    <div class="content">
                        <h4 class="title">${title}</h4>
                        <p class="mail-body">${message}</p>
                    </div>
                </div>
            </body>
            
            </html>`;
};
