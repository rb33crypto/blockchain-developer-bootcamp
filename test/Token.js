const { expect } = require('chai');
const { ethers } = require('hardhat'); 

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(),'ether')
}

describe('Token', ()=> {
	//contianer for tests
	let token, accounts, deployer, receiver

	beforeEach(async ()=> {
		//1. fetch token from blockchain
		const Token = await ethers.getContractFactory('Token')
		token = await Token.deploy('Dapp University', 'DAPP', '1000000')

		accounts = await ethers.getSigners()
		deployer = accounts[0]
		receiver = accounts[1]
	})

	describe('Deployment', ()=>{
		const name = 'Dapp University'
		const symbol = 'DAPP'
		const decimals = '18'
		const totalSupply = tokens('1000000')
		
		it('has correct name', async ()=>{
			//2 and 3. read that name is correct
			expect(await token.name()).to.equal(name)
		})

		it('has correct symbol', async ()=>{
			//2 and 3. read that symbol is correct
			expect(await token.symbol()).to.equal(symbol)
		})

		it('has correct decimals', async ()=>{
			//2 and 3. read that symbol is correct
			expect(await token.decimals()).to.equal(decimals)
		})

		it('has correct total supply', async ()=>{
			//2 and 3. read that symbol is correct
			expect(await token.totalSupply()).to.equal(totalSupply)
		})

		it('assigns total supply to deployer', async () => {
			expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
		})	
	
	})

	describe('Sending Tokens', ()=> {
		let amount, transaction, result

		describe('Success', () =>{

			beforeEach(async () =>{
				amount = tokens(100)
				transaction = await token.connect(deployer).transfer(receiver.address, amount)
				result = await transaction.wait()
			})

			it('transfers token balances', async () => {
        		expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
        		expect(await token.balanceOf(receiver.address)).to.equal(amount)
      		})
			it('emits transfer event', async() => {
				const event = result.events[0]
				console.log(event)
				expect(event.event).to.equal('Transfer')

				const args = event.args
				expect(args.from).to.equal(deployer.address)
				expect(args.to).to.equal(receiver.address)
				expect(args.value).to.equal(amount)

			})
		})

		describe('Failure', () => {
			it('rejects insuffiecient balance', async () => {
				const invalidAmount = tokens(100000000)
				await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
			})

			it('rejects invalid recepient', async () => {
				const amount = tokens(100)
				await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
			})
		})
	})


})
