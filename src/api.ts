import * as fetch from 'node-fetch';

const baseurl = 'https://api.guildwars2.com/v2';

export function get_info_from_api(c: any): any {
    switch (c.type) {
        case 'item':
            let ids = [c.id, c.skin, ... c.upgrades].filter(a => !!a).join(',');
            return fetch(baseurl + '/items?ids=' + ids)
                .then(b => b.json());
        default:
            return {};
    }
}