import TokenAbi from "../abi/Token.json";
import MatkaAbi from "../abi/Matka.json";

export const SubPath = "/";

export const PROJECT_NAME = "Matka";

export const RemoveExpo = (x) => {
  var data = String(x).split(/[eE]/);
  if (data.length === 1) return data[0];

  var z = "",
    sign = x < 0 ? "-" : "",
    str = data[0].replace(".", ""),
    mag = Number(data[1]) + 1;

  if (mag < 0) {
    z = sign + "0.";
    while (mag++) z += "0";
    return z + str.replace(/^\-/, "");
  }
  mag -= str.length;
  while (mag--) z += "0";
  return str + z;
};

export const CONTRACT_ADDRESS = {
  token: "0x3270FeB4DA58eD8d95Bd8f04CBA5B24a1bb4925a",
  matka: "0x7717FC488464efa40AaABB260D063d7783660C44",
};

export const CONTRACT_ABI = {
  token: TokenAbi,
  matka: MatkaAbi,
};

/**
 * @constant RUNNING_CHAIN  correct chain id, in decimal
 */
export const RUNNING_CHAIN = 97;

export const EXPLORER = "https://testnet.bscscan.com/";

export const IsHex = (n) => {
  const re = /[0-9A-Fa-f]{6}/g;

  if (re.test(n)) {
    return true;
  } else {
    return false;
  }
};
