import { SHOP } from '../constants';
import { oneEther } from '../../test/helpers/numbers';
import { deployCard } from './deploy_weapon';

const name = 'Chancleta';
const damageBoost = 15;
const cost = oneEther.mul(700);

const func = deployCard(name, damageBoost, cost);
export default func;

func.tags = [SHOP];
