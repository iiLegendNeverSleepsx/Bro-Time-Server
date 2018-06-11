/* eslint-disable max-len, comma-spacing */
module.exports={id:"gamble",aliases:["bet"],description:"Allows you to either lose all the bet money, or gain some more money.",paramsHelp:"(amount)",execute:async(call)=>{var amountToBet=Number(call.params.readParameter());var userBalance=await call.getWallet(call.message.author.id).getTotal();if(amountToBet!=null&&!isNaN(amountToBet)&&amountToBet>0){if(amountToBet<userBalance){var randomSuccess=Math.random()*10;randomSuccess=(randomSuccess<4)?true:false;var randomMultiplier=(Math.random()*0.8)+0.6;if(randomSuccess){call.getWallet(call.message.author.id).change(Math.round(amountToBet*randomMultiplier)).then(()=>{call.message.reply("You gained "+Math.round(amountToBet*randomMultiplier)+" Bro Bits. :D").catch(()=>{});}).catch(()=>{call.message.reply("Failed to change your balance. You did not gain/lose any Bro Bits.").catch(()=>{call.message.author.send(`You attempted to use the \`gamble\` command in ${call.message.channel}, but I can not chat there.`).catch(()=>{});});});}else{call.getWallet(call.message.author.id).change(-amountToBet).then(()=>{call.message.reply("You lost "+amountToBet+" Bro Bits. D:");}).catch(()=>{call.message.reply("Failed to change your balance. You did not gain/lose any Bro Bits.").catch(()=>{call.message.author.send(`You attempted to use the \`gamble\` command in ${call.message.channel}, but I can not chat there.`).catch(()=>{});});});}}else{call.message.reply("You do not have enough money to bet this amount.").catch(()=>{call.message.author.send(`You attempted to use the \`gamble\` command in ${call.message.channel}, but I can not chat there.`).catch(()=>{});});}}else{call.message.reply("Please specify a valid amount to bet.").catch(()=>{call.message.author.send(`You attempted to use the \`gamble\` command in ${call.message.channel}, but I can not chat there.`).catch(()=>{});});}}};

/*
Please take note that this file is compiled as a joke.

Success rate (of gaining money): 40%
Input multiplying rate (when gaining money): 60% - 140%
*/
