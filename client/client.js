let blips = [];

const PLAYER_SRC = GetPlayerServerId(PlayerId()).toString();
const BLIP_HASH = GetHashKey(Config.BlipHash);
const BLIP_STYLE_PLAYER = GetHashKey('BLIP_STYLE_MP_PLAYER');
const BLIP_MODIFY_PULSE = GetHashKey('BLIP_MODIFIER_PULSE_FOREVER');
const BLIP_MODIFY_COLOR = GetHashKey(Config.BlipColorModifier);
const BLIP_MODIFY_OFFLINE = GetHashKey('BLIP_MODIFIER_MP_PLAYER_UNAVAILABLE');
const BLIP_MODIFY_FADE_OUT = GetHashKey('BLIP_MODIFIER_FADE_OUT_SLOW');

onNet('vfs-playerblips:client:Update', (data) => {
    data = data.filter(player => player.src !== PLAYER_SRC);

    data.forEach(player => {
        const [x, y, z] = player.position;
        const exists = blips.find(blip => blip.src === player.src);
        if (exists) SetBlipCoords(exists.blip, x, y, z);
        else {
            const blip = Citizen.invokeNative('0x554D9D53F696D002', BLIP_STYLE_PLAYER, x, y, z); // BlipAddForCoords
            SetBlipSprite(blip, BLIP_HASH, true);
            SetBlipScale(blip, Config.BlipScale);
            SetBlipFlashes(blip, true);
            Citizen.invokeNative('0x9CB1A1623062F402', blip, player.name); // SetBlipName
            Citizen.invokeNative('0x662D364ABF16DE2F', blip, BLIP_MODIFY_PULSE) // BlipAddModifier
            Citizen.invokeNative('0x662D364ABF16DE2F', blip, BLIP_MODIFY_COLOR) // BlipAddModifier

            blips.push({ blip, src: player.src, name: player.name })
        }
    })
    if (blips.length > data.length) {
        const obsoleteBlips = blips.filter(blip => !data.find(player => player.src === blip.src))
        
        obsoleteBlips.forEach(blip_ => {
            const blip = blip_.blip;

            Citizen.invokeNative('0xB059D7BD3D78C16F', blip, BLIP_MODIFY_PULSE) // BlipRemoveModifier
            Citizen.invokeNative('0x662D364ABF16DE2F', blip, BLIP_MODIFY_OFFLINE); // BlipAddModifier
            Citizen.invokeNative('0x662D364ABF16DE2F', blip, BLIP_MODIFY_FADE_OUT); // BlipAddModifier
            Citizen.invokeNative('0x9CB1A1623062F402', blip, `[OFFLINE] ${blip.name}`); // SetBlipName

            setTimeout(() => {
                if (DoesBlipExist(blip)) RemoveBlip(blip);
            }, Config.OfflineTimeout * 1000);
        });
        blips = blips.filter(blip => data.find(player => player.src === blip.src));
    }
})

onNet('vfs-playerblips:client:Clear', () => {
    clearBlips();
})

on('onResourceStop', (resource) => {
    if (resource !== GetCurrentResourceName()) return;
    clearBlips();
})

function clearBlips() {
    blips.forEach(blip_ => {
        const blip = blip_.blip;
        if (DoesBlipExist(blip)) RemoveBlip(blip);
    })
}