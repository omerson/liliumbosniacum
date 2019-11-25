import React from 'react';
import { API } from 'aws-amplify';
import StripeCheckout from 'react-stripe-checkout';

const stripeConfig = {
    currency: "EUR",
    publishableAPIKey: "pk_test_ZnApodWjWxwK54tNyytakRw9005dw9A3br"
};

const PayButton = ({ anonymous, amount, name, email }) => {

    const handleCharge = async (token) => {
        try {
            // name of API, and path to REST
            const result = await API
                .post('stripeResource', 
                      '/donate', 
                      {
                        body: {
                          token,
                          donation: {
                              currency: stripeConfig.currency,
                              amount: amount,
                              description: name
                          }
                        }
                      });

            console.log(result);
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <StripeCheckout
            token={handleCharge}
            name={anonymous ? 'anonymous' : name}
            amount={amount}
            currency={stripeConfig.currency}
            stripeKey={stripeConfig.publishableAPIKey}    
            locale='auto'
            allowRememberMe={false}
            email={email}
        >

        </StripeCheckout>
    )
};

export default PayButton