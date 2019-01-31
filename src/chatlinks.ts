import { isString } from "util";
import { Cursor } from "./cursor";
import { Bitfield } from "./bitfield";

const types = {
    coin: 0x01,
    item: 0x02,
    npc: 0x03,
    map: 0x04,
    pvp: 0x05,
    skill: 0x06,
    trait: 0x07,
    user: 0x08,
    recipe: 0x09,
    skin: 0x0A,
    outfit: 0x0B,
    objective: 0x0C,
};

// https://wiki.guildwars2.com/wiki/Chat_link_format#Wardrobe_skins_and_upgrades
const itemflags = {
    skin: 7,
    upgrade1: 6,
    upgrade2: 5,
};

const linkregex = /\[&([a-z\d+/]+=*)\]/i;

export function decode(buf: Cursor | Buffer | string) {
    if (isString(buf)) {
        if (!linkregex.test(buf)) {
            throw new Error(`invalid input string: '${buf}'`);
        }
        buf = buf.match(linkregex)![1];
        buf = new Cursor(Buffer.from(buf, 'base64'));
    } else if (Buffer.isBuffer(buf)) {
        buf = new Cursor(buf);
    }

    let ret: any = {}; // any for now

    const type_id = buf.readInt8();

    ret.type = type_name(type_id);

    if (types.item === type_id) {
        ret.quantity = buf.readInt8();
    }

    ret.id = buf.readInt24LE();
    
    // Special item stuff such as skins and upgrades
    if (types.item === type_id) {
        const flags = new Bitfield(buf.readInt8());
        ret.upgrades = [];

        if (flags.is_set(itemflags.skin)) {
            ret.skin = buf.readInt24LE();
            buf.readInt8(); // always 0
        }

        if (flags.is_set(itemflags.upgrade1)) {
            ret.upgrades.push(buf.readInt24LE());
            buf.readInt8();
        }

        if (flags.is_set(itemflags.upgrade2)) {
            ret.upgrades.push(buf.readInt24LE());
        }
    } else if (types.objective === type_id) {
        buf.readInt8();
        ret.id = buf.readInt24LE() + '-' + ret.id;
    }

    return ret;
}

function type_name(type_id: number): string {
    for (const [k, v] of Object.entries(types)) {
        if (v === type_id) {
            return k;
        }
    }
    throw new Error(`No Link type with id '${type_id}' found.`);
}
