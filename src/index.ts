import { Client, RichEmbed } from "discord.js";
import { decode } from './chatlinks';
import { get_info_from_api } from './api';

const c = new Client();

c.on('ready', () => {
    console.log(`Logged in as ${c.user.tag}`);
});

c.on('message', msg => {
    const re =  /\[&([a-z\d+/]+=*)\]/i;
    if (!re.test(msg.content)) {
        return;
    }
    const b64 = msg.content.match(re)![1];
    const buf = Buffer.from(b64, 'base64');
    try {
        const ret = decode(buf);
        const info = get_info_from_api(ret);
        if (info !== {}) {
            const reply = new RichEmbed()
                .setTitle(info[0].name);
            msg.channel.send(reply);
        }
        console.log(info);
    } catch (e) {
        console.error(e);
    }
});

c.login('token here');