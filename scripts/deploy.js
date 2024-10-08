async function main() {
  //fetch contract to deploy
  const Token = await ethers.getContractFactory("Token")
  //deploy contract
  const token = await Token.deploy('DAPP University', 'DAPP', '1000000')
  await token.deployed()
  console.log(`Token Deployed to: ${token.address}`)

}

main()
.then(() => process.exit(0))
.catch((error) => {  
  console.error(error);
  process.exit(1);
});
