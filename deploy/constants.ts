import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

export const CASH = 'Cash';
export const PLAYER = 'Player';
export const PLAYER_STATS = 'PlayerStats';
export const SCHEME_MANAGER = 'SchemeManager';
export const SCHEME_YIELD_FARM = 'YieldFarm';
export const SCHEME_SCROUNGE_FOR_SATOSHIS = 'ScroungeForSatochis';
export const SCHEME_TEST = 'TestScheme';
export const SHOP = 'Shop';
export const TREASURY = 'Treasury';
export const TRAINING = 'Training';

export const WEAPON_BASE = 'CardBase';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {};

export default func;
