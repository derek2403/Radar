import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";


// create the client with your clientId, or secretKey if in a server environment
export const client = createThirdwebClient({
    clientId: "eda76e0121006397d39cfffa42f46745"
});

export const chain = defineChain(11155111);


