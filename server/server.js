const VORPcore = exports.vorp_core.GetCore();

let playerPositions = [];
let listeningPlayers = [];
let updateInterval;

RegisterCommand(Config.Command, (source) => {
    const player = VORPcore.getUser(source);
    if (player.getGroup !== Config.RequiredGroup) return Notify(source, Lang.Notifications.no_permissions);


    if (listeningPlayers.includes(source)) {
        listeningPlayers = listeningPlayers.filter(src => src !== source);
        TriggerClientEvent('vfs-playerblips:client:Clear', source);
        Notify(source, Lang.Notifications.blips_disabled);
    } else {
        listeningPlayers.push(source);
        if (playerPositions.length > 0) TriggerClientEvent('vfs-playerblips:client:Update', source, playerPositions);
        Notify(source, Lang.Notifications.blips_enabled);
    }

    if (listeningPlayers.length < 1) return stopBlipInterval();

    startBlipInterval();
});

function updateBlips() {
    if (listeningPlayers.length < 1) return stopBlipInterval();

    const players = getPlayers();
    playerPositions = players.map(src => {
        const char = VORPcore.getUser(src).getUsedCharacter;
        return {
            src: src,
            name: `${char.firstname} ${char.lastname} (${GetPlayerName(src)})`,
            position: GetEntityCoords(GetPlayerPed(src))
        }
    });

    listeningPlayers.forEach(src => {
        TriggerClientEvent('vfs-playerblips:client:Update', src, playerPositions);
    })
}

function startBlipInterval() {
    updateBlips();
    updateInterval = setInterval(updateBlips, Config.UpdateInterval * 1000);
}

function stopBlipInterval() {
    playerPositions = [];
    listeningPlayers = [];
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = null;
}

on('playerDropped', () => {
    listeningPlayers = listeningPlayers.filter(src => src !== global.source);
});

function Notify(src, text) {
    VORPcore.NotifyTip(src, text, 3000);
}