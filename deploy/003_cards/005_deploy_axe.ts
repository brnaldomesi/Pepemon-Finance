import { SHOP } from '../constants';
import { oneEther } from '../../test/helpers/numbers';
import { deployCard } from './deploy_weapon';

const name = 'Axe';
const damageBoost = 40;
const cost = oneEther.mul(1500);

const func = deployCard(name, damageBoost, cost);
export default func;

func.tags = [SHOP];
