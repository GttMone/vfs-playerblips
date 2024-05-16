let Config = {};

Config.Command = 'blips' // Command to toggle blips on/off.
Config.RequiredGroup = 'admin' // Required user group to use the command

Config.UpdateInterval = 5; // Update interval in seconds (only updates if more than one admin has blips enabled)
Config.OfflineTimeout = 60 // After how many seconds a blip gets deleted when the player has gone offline.

Config.BlipHash = 'blip_ambient_companion'
// https://github.com/femga/rdr3_discoveries/tree/master/useful_info_from_rpfs/textures/blips
// https://github.com/femga/rdr3_discoveries/tree/master/useful_info_from_rpfs/textures/blips_mp

Config.BlipScale = 2
Config.BlipColorModifier = 'BLIP_MODIFIER_MP_COLOR_1' // https://github.com/femga/rdr3_discoveries/tree/master/useful_info_from_rpfs/blip_modifiers