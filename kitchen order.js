const fsn = require('fs-nextra');
exports.run = (client, msg, args) => {
    order = args.join(' ')
    fsn.readJSON('./orders.json')
        .then((orderDB) => {
            function makeID() {
                let id = '';
                let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
                for (let i = 0; i < 5; i++) id += possible.charAt(Math.floor(Math.random() * possible.length));
                //eslint-disable-next-line newline-before-return
                return id;
            }
            const orderID = makeID()

            if (!orderDB[orderID]) orderDB[orderID] = {
                'orderID': orderID,
                'userID': msg.author.id,
                'guildID': msg.guild.id,
                'channelID': msg.channel.id,
                'order': order,
                'status': 'Waiting'
            }

            fsn.writeJSON('./orders.json', orderDB, {
                    replacer: null,
                    spaces: 2
                })
                .then(() => {
                    msg.reply(`Your order has been sent to the kitchen! Your order ID is \`${orderID}\``)
                    let ordersChan = client.channels.get('433831764105101332')
                    ordersChan.send(`__**Order**__
**OrderID:** ${orderID}
**Order:** ${order}
**Customer:** ${msg.author.tag} (${msg.author.id})
**Ordered from:** #${msg.channel.name} (${msg.channel.id}) in ${msg.guild.name} (${msg.guild.id})
**Status:** Awaiting a cook`)
                })
                .catch((err) => {
                    if (err) {
                        msg.reply(`There was a database error!
Show the following message to a developer:
\`\`\`${err}\`\`\``)
                        console.error(`Error in order ${orderID}
${err}`)
                    }
                })
        })
}
