import { SHOP } from '../constants';
import { oneEther } from '../../test/helpers/numbers';
import { deployCard } from './deploy_weapon';

const name = 'Knuckle Dusters';
const damageBoost = 10;
const cost = oneEther.mul(375);

const func = deployCard(name, damageBoost, cost);
export default func;

func.tags = [SHOP];
