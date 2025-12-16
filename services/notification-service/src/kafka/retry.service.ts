import { Injectable } from "@nestjs/common";


@Injectable()
export class RetryService  {
    async execute(fn: () => Promise<void>, retries = 3, delayms = 1000) {  
        let attempt=0;
        while(attempt<retries){
            try{
                await fn ();
                return;
            }catch(err){
                attempt++;
                console.error(`Attempt ${attempt}/${retries} failed. Retrying in ${delayms}ms...`, err);
                if(attempt>=retries){
                    console.error('All retry attempts failed.');
                    throw err;
                }
                // wait for delayms before next attempt
                await new Promise(res => setTimeout(res, delayms));
            }

        }
    
    
}
}
