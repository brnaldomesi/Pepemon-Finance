import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { WEAPON_BASE } from '../constants';

import { SHOP } from '../constants';
import { oneEther } from '../../test/helpers/numbers';
import { deployCard } from './deploy_weapon';

const name = 'Plastic Knife';
const damageBoost = 3;
const cost = oneEther.mul(80);

const func = deployCard(name, damageBoost, cost);
export default func;

func.tags = [SHOP];
