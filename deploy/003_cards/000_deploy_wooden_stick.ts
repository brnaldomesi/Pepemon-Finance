import { SHOP } from '../constants';
import { oneEther } from '../../test/helpers/numbers';
import { deployCard } from './deploy_weapon';

const name = 'Wooden Stick';
const damageBoost = 5;
const cost = oneEther.mul(200);

const func = deployCard(name, damageBoost, cost);
export default func;

func.tags = [SHOP];
