import { SHOP } from '../constants';
import { oneEther } from '../../test/helpers/numbers';
import { deployCard } from './deploy_weapon';

const name = 'Switchblade';
const damageBoost = 25;
const cost = oneEther.mul(900);

const func = deployCard(name, damageBoost, cost);
export default func;

func.tags = [SHOP];
