# Supreme Store
A React store app complete with item manipulation, JWT-based auth, shopping cart, Stripe checkout, order history, permissions management, item search bar.

## Libraries Used
### Frontend
React, Next.js, Apollo Client, Styled-components

### Backend
Node, Express, Yoga, Prisma

## Dev Setup
```
npm install
npm run dev
```

## Deployment
The frontend and backend are both hosted using [Zeit Now](https://zeit.co/now) free tier for serverless deployments.
```
now
```

## Services Used
* Now for both Frontend and Backend deployments
* Heroku + Prisma for hosting database
* Stripe for cart checkout
* Cloudinary for image scaling / resizing
* Mail Trap for email password reset testing

## Things to Note
Due to using Zeit Now's free tier, the backing VMs can sometimes get suspended/frozen if there's no traffic to the site for long enough. This results in a cold start penalty for some page loads, which can take several seconds to complete while Now unfreezes the backing VM.

Stripe checkout uses demo/test creds, and will not actually charge the credit card.
However, the system has been tested using [Stripes test credit cards](https://stripe.com/docs/testing) and does work.

Password reset works, but currently gets sent to a free-tier testing inbox hosted by [Mail Trap](https://mailtrap.io/).
