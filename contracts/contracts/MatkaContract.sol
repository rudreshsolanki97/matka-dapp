// Created By Rudresh

pragma solidity ^0.8.0;

import "./common/Ownable.sol";
import "./common/SafeERC20.sol";
import "./interfaces/IERC20.sol";



contract Matka is Ownable {

  using SafeERC20 for IERC20;

  IERC20 public token;



  uint256 private MAX_INT = 2**256 - 1;

  struct Bid {
    uint256 amount;
    uint256 number;
    uint256 poolId;
  }


  //  operator fee in percent
  uint256 public operatorFee;
  //  poolInterval in seconds
  uint256 public poolInterval;
  // whether matka is on
  bool public poolActive;


  mapping (address => mapping(uint256 => Bid)) private bids;
  mapping (address => uint256) private lastSyncBid;
  mapping (uint256 => mapping(uint256 => uint256)) private poolBets; 


  struct Pool {
    uint256 poolId;
    uint256 totalPoolAmount;
    uint256 winner;
    uint256 startTime;
    uint256 endTime;
    uint256 operatorFee;
    bool completed;
  }

  Pool[] public allPools;
  Pool public currentPool;


  modifier isPoolActive() {
    require(poolActive == true, "Matka: pool not active");
    _;
  }

  constructor (uint256 _poolInterval, uint256 _operatorFee, IERC20 _token) {
    poolInterval = _poolInterval;
    token = _token;
    operatorFee = _operatorFee;
    // genesis pool
    currentPool=Pool({
          poolId:allPools.length,
          totalPoolAmount:0,
          winner:0,
          startTime:block.timestamp,
          endTime:block.timestamp,
          operatorFee:operatorFee,
          completed:false          
    });
  }

  /**
  
    Operator Functionality Starts

   */

   function updateOperatorFee(uint256 _operatorFee) public onlyOwner {
     operatorFee = _operatorFee;
   }

   function setPoolStatus(bool _status) public onlyOwner {
     poolActive = _status;
   }

   function setPoolInterval(uint256 _poolInterval) public onlyOwner {
     poolInterval = _poolInterval;
   }


  /**
  
    Operator Functionality Stops
  
   */


  /**
  
    User Functionality Starts
  
   */

  function bid(uint256 amount, uint256  number) isPoolActive public {
    require(number<=9, "Matka: can bet on a single digit number only");
    require(amount>0, "Matka: bet amount has to be greater than zero");
    require(currentPool.endTime>block.timestamp, "Matka: pool closed");
    require(bids[msg.sender][currentPool.poolId].amount==0 || bids[msg.sender][currentPool.poolId].number==number, "Matka: cannot change the bet number");


    token.safeTransferFrom(msg.sender, address(this), amount);
    if (bids[msg.sender][currentPool.poolId].amount>0)  {
      bids[msg.sender][currentPool.poolId].amount  += amount;
    }else {
      Bid memory newBid = Bid({amount:amount, number:number,poolId: currentPool.poolId});
      bids[msg.sender][currentPool.poolId] = newBid;
    }
    currentPool.totalPoolAmount += amount;
    poolBets[currentPool.poolId][number] += amount;
  }

  function pendingBalance(address bettor) view public returns(uint256) {
    uint256 lastSync = lastSyncBid[bettor];
    uint256 earned = 0;
    for (uint256 i=lastSync+1;i<allPools.length;i++) {
      if ( bids[msg.sender][i].amount> 0 && allPools[i].winner==bids[msg.sender][i].number) {
        earned +=  (bids[msg.sender][i].amount*10) - (bids[msg.sender][i].amount*10*allPools[i].operatorFee / 100);
      }
    }
    return earned;
  }

  function withrawRewards() public {
    uint256 earned = pendingBalance(msg.sender);
    require(earned>0,"Matka: no rewards to withdraw");
    lastSyncBid[msg.sender] = allPools.length-1;
    token.safeTransfer(msg.sender, earned);
  }

  function getMyBet(uint256 poolId) view public returns (uint256 amount, uint256 number, uint256 winner) {
    amount = bids[msg.sender][poolId].amount;
    number = bids[msg.sender][poolId].number;
    if (poolId==currentPool.poolId) winner=0;
    else winner = allPools[poolId].winner;
  }

  /**
  
    user functionality ends

   */
  

  function sync() public {
     if (block.timestamp > currentPool.endTime ) {
      // can start new  pool
      if (currentPool.completed==false) {
        uint256 minIndex=0;
        uint256 minAmount=MAX_INT;
        for (uint i=0;i<10;i++) {
            if (minAmount>poolBets[currentPool.poolId][i]) {
                minIndex=i;
                minAmount=poolBets[currentPool.poolId][i];
            }
        }
        currentPool.winner=minIndex;
        currentPool.completed=true;
        allPools.push(currentPool);
      }

      if (poolActive==true) {
        currentPool = Pool({
          poolId:allPools.length,
          totalPoolAmount:0,
          winner:0,
          startTime:block.timestamp,
          endTime:block.timestamp+poolInterval,
          operatorFee:operatorFee,
          completed:false          
        });
      }
    }
  }
}