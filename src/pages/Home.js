import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useNetwork } from 'wagmi'
import headerLogo from '../assets/header.png'
import headerLeft from '../assets/headerLeft.svg'
import docu from '../assets/docu.svg'
import discord from '../assets/discord.svg'
import Rect1 from '../assets/Rectangle1.png'
import info from '../assets/info.svg'
import E1 from '../assets/ellipse1.png'
import E2 from '../assets/ellipse2.png'
import E3 from '../assets/ellipse3.png'
import E4 from '../assets/ellipse4.png'
import E5 from '../assets/ellipse5.png'
import E6 from '../assets/ellipse6.png'
import E7 from '../assets/ellipse7.png'
import E8 from '../assets/ellipse8.png'
import MAV from '../assets/MAV.png'
import Community from '../assets/Community.png'
import IDis from '../assets/Discord.png'
import ITwi from '../assets/Twitter.png'
import IMir from '../assets/Mirror.png'
import { faq } from '../global/constants'
import Accordion from '../components/Accordion'
import { useEffect, useState } from 'react'

import { Slider } from '@mui/material'
import { styled } from '@mui/material/styles'
import Web3 from 'web3'
import tokenAbi from '../global/tokenAbi.json'
import pancakeSwapAbi from '../global/pancakeAbi.json'

let pancakeSwapContract = "0x10ED43C718714eb63d5aA57B78B54704E256024E".toLowerCase();

const iOSBoxShadow =
    '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const marks = [
    {
        value: 0,
        label: 'Min'
    },
    {
        value: 25,
        label: '25%'
    },
    {
        value: 50,
        label: '50%',
    },
    {
        value: 75,
        label: '75%'
    },
    {
        value: 100,
        label: 'Max'
    },
];

const IOSSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#3880ff' : '#3880ff',
    height: 2,
    padding: '15px 0',
    '& .MuiSlider-thumb': {
        height: 12,
        width: 12,
        backgroundColor: '#fff',
        boxShadow: iOSBoxShadow,
        '&:focus, &:hover, &.Mui-active': {
            boxShadow:
                '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                boxShadow: iOSBoxShadow,
            },
        },
    },
    '& .MuiSlider-markLabel': {
        color: '#ffffff'
    },
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-rail': {
        opacity: 0.5,
        backgroundColor: '#bfbfbf',
    },
    '& .MuiSlider-mark': {
        backgroundColor: '#bfbfbf',
        height: 10,
        width: 4,
        '&.MuiSlider-markActive': {
            opacity: 1,
            backgroundColor: 'currentColor',
        },
    },
}));

const Home = () => {
    const { chain } = useNetwork()
    const [val, setVal] = useState('0.02')

    async function calcSell(tokensToSell, tokenAddres) {
        const web3 = new Web3("https://bsc-dataseed1.binance.org");
        const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB
        const USDTokenAddress = "0x55d398326f99059fF775485246999027B3197955" //USDT
        console.log('succ')
        let tokenRouter = await new web3.eth.Contract(tokenAbi, tokenAddres);
        let tokenDecimals = await tokenRouter.methods.decimals().call();

        tokensToSell = setDecimals(tokensToSell, tokenDecimals);
        let amountOut;
        try {
            let router = await new web3.eth.Contract(pancakeSwapAbi, pancakeSwapContract);

            amountOut = await router.methods.getAmountsOut(tokensToSell, [tokenAddres, USDTokenAddress]).call();

            console.log(amountOut)
            amountOut = web3.utils.fromWei(amountOut[1]);
        } catch (error) {
            console.log(error)
        }

        if (!amountOut) return 0;
        return amountOut;
    }
    async function calcBNBPrice() {
        const web3 = new Web3("https://bsc-dataseed1.binance.org");
        const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB
        const USDTokenAddress = "0x55d398326f99059fF775485246999027B3197955" //USDT
        let bnbToSell = web3.utils.toWei("1", "ether");
        console.log('---bnbToSell', bnbToSell)
        let amountOut;
        try {
            let router = await new web3.eth.Contract(pancakeSwapAbi, pancakeSwapContract);
            amountOut = await router.methods.getAmountsOut(bnbToSell, [BNBTokenAddress, USDTokenAddress]).call();
            console.log('----------------', amountOut)
            amountOut = web3.utils.fromWei(amountOut[1]);
        } catch (error) {
            console.log(error)
        }
        if (!amountOut) return 0;
        return amountOut;
    }
    function setDecimals(number, decimals) {
        number = number.toString();
        let numberAbs = number.split('.')[0]
        let numberDecimals = number.split('.')[1] ? number.split('.')[1] : '';
        while (numberDecimals.length < decimals) {
            numberDecimals += "0";
        }
        return numberAbs + numberDecimals;
    }

    useEffect(() => {
        console.log('network', chain)
    }, [chain])

    const handleInput = (e) => {
        setVal(e.target.value)
    }

    const handleClick = async () => {
        console.log('----------')
        const tokenAddres = '0xd691d9a68C887BDF34DA8c36f63487333ACfD103'; // change this with the token addres that you want to know the 
        let bnbPrice = await calcBNBPrice() // query pancakeswap to get the price of BNB in USDT
        console.log(`CURRENT BNB PRICE: ${bnbPrice}`);
        // Them amount of tokens to sell. adjust this value based on you need, you can encounter errors with high supply tokens when this value is 1.
        let tokens_to_sell = 1;
        let priceInBnb = await calcSell(tokens_to_sell, tokenAddres) / tokens_to_sell; // calculate TOKEN price in BNB
        console.log('SHIT_TOKEN VALUE IN BNB : ' + priceInBnb + ' | Just convert it to USD ');
        console.log(`SHIT_TOKEN VALUE IN USD: ${priceInBnb * bnbPrice}`);
    }

    return (
        <div className='bg-black'>
            <div className='w-full px-12 py-8 flex justify-between'>
                <img alt="#" src={headerLeft} />
                <ConnectButton />
            </div>
            <div className='flex flex-col gap-24 items-center text-white'>
                <img alt="#" className='absolute z-[1] top-[-30px]' src={headerLogo} />
                <div className='text-[100px]'>Pre-Launch</div>
                <div className='text-[24px]'>Help bootstrap Rogue, the liquid starter & yield booster for Maverick AMM</div>
                <div className='flex gap-2'>
                    <div className='flex justify-center gap-4 py-2 bg-white text-black w-[320px] rounded-md'>
                        <img alt="#" src={docu} />
                        <p>Read Documentation</p>
                    </div>
                    <div className='flex justify-center gap-4 py-2 bg-gray-800 text-white w-[320px] rounded-md'>
                        <img alt="#" src={discord} />
                        <p>Join our Discord</p>
                    </div>
                </div>
            </div>

            <div className='relative pt-48'>
                <img alt="#" className='w-full pb-48 px-2 absolute h-full' src={Rect1} />
                <div className='flex gap-4 p-12 relative'>
                    <div className='text-white text-center w-1/4'>
                        <p className='phase py-1 rounded-t-xl'>PHASE 2</p>
                        <p className='bg-[#34373D] py-2 rounded-tl-none rounded-xl'>0.8% of ROG Supply</p>
                    </div>
                    <div className='text-white text-center w-1/4'>
                        <p className='phase py-1 rounded-t-xl'>WEEK 2</p>
                        <p className='bg-[#34373D] py-2 rounded-tl-none rounded-xl'>0.6% of ROG Supply</p>
                    </div>
                    <div className='text-white text-center w-1/4'>
                        <p className='phase py-1 rounded-t-xl'>WEEK 3</p>
                        <p className='bg-[#34373D] py-2 rounded-tl-none rounded-xl'>0.4% of ROG Supply</p>
                    </div>
                    <div className='text-white text-center w-1/4'>
                        <p className='phase py-1 rounded-t-xl'>WEEK 4</p>
                        <p className='bg-[#34373D] py-2 rounded-tl-none rounded-xl'>0.2% of ROG Supply</p>
                    </div>
                </div>
                <div className='flex p-4 relative'>
                    <div className='w-1/3 flex flex-col items-center'>
                        <div className='flex gap-2 text-gray-500'>
                            My Share
                            <img alt="#" src={info} />
                        </div>
                        <p className='text-white text-5xl'>1%</p>
                    </div>
                    <div className='w-1/3 flex flex-col items-center'>
                        <div className='flex gap-2 text-gray-500'>
                            Total Staked
                            <img alt="#" src={info} />
                        </div>
                        <p className='text-white text-5xl'>10K MAV</p>
                    </div>
                    <div className='w-1/3 flex flex-col items-center'>
                        <div className='flex gap-2 text-gray-500'>
                            My Stake
                            <img alt="#" src={info} />
                        </div>
                        <p className='text-white text-5xl'>100 MAV</p>
                    </div>
                </div>
                <div className='flex px-4 pt-8 gap-2 relative'>
                    <div className='w-1/2 rounded-[30px] bg-[#040404]'>
                        <div className='bg-[#141414] rounded-2xl m-1'>
                            <img alt="#" className='absolute' src={E1} />
                            <img alt="#" className='absolute' src={E2} />
                            <img alt="#" className='absolute' src={E3} />
                            <img alt="#" className='absolute' src={E4} />
                            <div className='relative z-[1] flex text-white py-12 text-center'>
                                <div className='flex justify-center w-1/2'>Deposit
                                    <div className='absolute bg-white' style={{ bottom: '-3px', width: '100px', height: '2px', boxShadow: '0px -13px 40px 7px' }}></div></div>
                                <div className='flex justify-center w-1/2'>Withdraw
                                    <div className='absolute bg-gray-500' style={{ bottom: '-3px', width: '100px', height: '2px', boxShadow: '0px -13px 40px 4px' }}></div></div>
                            </div>
                        </div>
                        <div className='flex pt-24 px-24'>
                            <div className='w-1/2'>
                                <p className='absolute text-gray-400 text-[12px]'>Amount</p>
                                <div className='max-w-[500px] min-w-[50px]'>
                                    <input value={val} onChange={(ev) => handleInput(ev)}
                                        className='w-full pt-4 text-3xl bg-transparent border-r-2 placeholder:text-white text-white focus:outline-none h-[60px]'
                                        style={{ width: `${val.length}ch` }} placeholder='0.02'
                                    />
                                </div>
                            </div>
                            <div className='flex justify-between items-center w-1/2 bg-[#222222] rounded-xl px-4 py-2' style={{ height: '100%' }}>
                                <div className='flex items-center'>
                                    <img alt="#" width={32} src={MAV} />
                                    <p className='px-4 text-white'>MAV</p>
                                </div>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.75593 5.12713C5.35716 5.58759 4.64284 5.58759 4.24407 5.12713L1.23682 1.65465C0.675943 1.00701 1.136 9.13357e-08 1.99275 1.66235e-07L8.00725 6.9204e-07C8.864 7.6694e-07 9.32406 1.00701 8.76318 1.65465L5.75593 5.12713Z" fill="white" />
                                </svg>
                            </div>
                        </div>
                        <div className='flex pt-8 px-24'>
                            <div className='text-white w-1/2'>= $ 12.34 (USD)</div>
                            <div className='text-gray-500 w-1/2 flex gap-2 justify-end'>
                                <p>(Available Balance: 0.00)</p>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.5 2C13.1894 2 13.8136 2.27905 14.2659 2.73036C14.2834 2.74784 14.3007 2.76559 14.3177 2.78358C14.7174 3.20678 14.971 3.76953 14.9977 4.39107L14.9985 4.41205C14.9995 4.44124 15 4.47056 15 4.5V4.51426C15 4.55491 15.0247 4.59145 15.0623 4.60702C15.0998 4.62261 15.1431 4.61423 15.1719 4.58546L15.182 4.57538C15.2028 4.55456 15.2239 4.53419 15.2452 4.51426L15.2607 4.5C15.719 4.07934 16.2962 3.86073 16.8782 3.84417C16.9029 3.84346 16.9277 3.84312 16.9524 3.84315C17.5913 3.84382 18.23 4.0879 18.7175 4.57538L19.4246 5.28249C19.9121 5.76997 20.1562 6.40868 20.1569 7.0476C20.1569 7.07234 20.1565 7.09709 20.1558 7.12182C20.1393 7.70375 19.9207 8.281 19.5 8.73935L19.4857 8.75476C19.4658 8.77611 19.4454 8.7972 19.4246 8.81802L19.4145 8.82811C19.3858 8.85687 19.3774 8.90017 19.393 8.93775C19.4085 8.97529 19.4451 9 19.4857 9H19.5C19.5294 9 19.5588 9.00051 19.5879 9.00152L19.6089 9.00233C20.2305 9.02898 20.7932 9.28257 21.2164 9.68233C21.2344 9.69933 21.2522 9.71659 21.2696 9.73411C21.721 10.1864 22 10.8106 22 11.5V12.5C22 13.1894 21.721 13.8136 21.2696 14.2659C21.2522 14.2834 21.2344 14.3007 21.2164 14.3177C20.7932 14.7174 20.2305 14.971 19.6089 14.9977L19.5879 14.9985C19.5588 14.9995 19.5294 15 19.5 15H19.4857C19.4451 15 19.4085 15.0247 19.393 15.0623C19.3774 15.0998 19.3858 15.1431 19.4145 15.1719L19.4246 15.182C19.4454 15.2028 19.4658 15.2239 19.4857 15.2452L19.5 15.2607C19.9207 15.719 20.1393 16.2962 20.1558 16.8782C20.1565 16.9029 20.1569 16.9277 20.1569 16.9524C20.1562 17.5913 19.9121 18.23 19.4246 18.7175L18.7175 19.4246C18.23 19.9121 17.5913 20.1562 16.9524 20.1568C16.9277 20.1569 16.9029 20.1565 16.8782 20.1558C16.2963 20.1393 15.719 19.9207 15.2607 19.5L15.2452 19.4857C15.2239 19.4658 15.2028 19.4454 15.182 19.4246L15.1719 19.4145C15.1431 19.3858 15.0998 19.3774 15.0623 19.393C15.0247 19.4085 15 19.4451 15 19.4857V19.5C15 19.5294 14.9995 19.5588 14.9985 19.5879L14.9977 19.6089C14.971 20.2305 14.7174 20.7932 14.3177 21.2164C14.3007 21.2344 14.2834 21.2522 14.2659 21.2696C13.8136 21.7209 13.1894 22 12.5 22H11.5C10.8106 22 10.1864 21.7209 9.73411 21.2696C9.71659 21.2522 9.69933 21.2344 9.68233 21.2164C9.28257 20.7932 9.02898 20.2305 9.00233 19.6089L9.00152 19.5879C9.00051 19.5588 9 19.5294 9 19.5V19.4857C9 19.4451 8.97529 19.4085 8.93774 19.393C8.90017 19.3774 8.85687 19.3858 8.8281 19.4145L8.81802 19.4246C8.7972 19.4454 8.77611 19.4658 8.75475 19.4857L8.73934 19.5C8.281 19.9207 7.70375 20.1393 7.12182 20.1558C7.09708 20.1565 7.07234 20.1569 7.0476 20.1568C6.40868 20.1562 5.76997 19.9121 5.28249 19.4246L4.57538 18.7175C4.0879 18.23 3.84382 17.5913 3.84315 16.9524C3.84312 16.9277 3.84346 16.9029 3.84417 16.8782C3.86073 16.2962 4.07934 15.719 4.5 15.2607L4.51426 15.2452C4.53419 15.2239 4.55456 15.2028 4.57538 15.182L4.58546 15.1719C4.61423 15.1431 4.62261 15.0998 4.60702 15.0623C4.59145 15.0247 4.55491 15 4.51426 15H4.5C4.47056 15 4.44125 14.9995 4.41205 14.9985L4.39107 14.9977C3.76953 14.971 3.20678 14.7174 2.78358 14.3177C2.76558 14.3007 2.74784 14.2834 2.73036 14.2659C2.27905 13.8136 2 13.1894 2 12.5V11.5C2 10.8106 2.27905 10.1864 2.73036 9.73411C2.74784 9.71659 2.76558 9.69933 2.78358 9.68233C3.20678 9.28257 3.76953 9.02898 4.39107 9.00233L4.41205 9.00152C4.44125 9.00051 4.47056 9 4.5 9H4.51426C4.55491 9 4.59145 8.97529 4.60702 8.93775C4.62261 8.90017 4.61423 8.85687 4.58546 8.82811L4.57538 8.81802C4.55456 8.7972 4.53419 8.77611 4.51426 8.75476L4.5 8.73935C4.07934 8.281 3.86073 7.70375 3.84417 7.12182C3.84346 7.09709 3.84312 7.07234 3.84315 7.0476C3.84382 6.40868 4.0879 5.76997 4.57538 5.28249L5.28249 4.57538C5.76997 4.0879 6.40868 3.84382 7.0476 3.84315C7.07234 3.84312 7.09709 3.84346 7.12182 3.84417C7.70375 3.86073 8.281 4.07934 8.73934 4.5L8.75476 4.51426C8.77611 4.53419 8.7972 4.55456 8.81802 4.57538L8.8281 4.58546C8.85687 4.61423 8.90017 4.62261 8.93775 4.60702C8.97529 4.59145 9 4.55491 9 4.51426V4.5C9 4.47056 9.00051 4.44124 9.00152 4.41205L9.00233 4.39107C9.02898 3.76953 9.28257 3.20678 9.68233 2.78358C9.69933 2.76559 9.71659 2.74784 9.73411 2.73036C10.1864 2.27905 10.8106 2 11.5 2H12.5ZM11 19.5C11 19.7761 11.2239 20 11.5 20H12.5C12.7761 20 13 19.7761 13 19.5V19.4857C13 18.6262 13.5212 17.8669 14.2962 17.5455C15.0727 17.2235 15.9787 17.3929 16.5861 18.0003L16.5962 18.0104C16.7915 18.2057 17.108 18.2057 17.3033 18.0104L18.0104 17.3033C18.2057 17.108 18.2057 16.7915 18.0104 16.5962L18.0003 16.5861C17.3929 15.9787 17.2235 15.0727 17.5455 14.2961C17.8669 13.5212 18.6262 13 19.4857 13H19.5C19.7761 13 20 12.7761 20 12.5V11.5C20 11.2239 19.7761 11 19.5 11H19.4857C18.6262 11 17.8669 10.4788 17.5455 9.70385C17.2235 8.92727 17.3929 8.02132 18.0003 7.41389L18.0104 7.40381C18.2057 7.20854 18.2057 6.89196 18.0104 6.6967L17.3033 5.98959C17.108 5.79433 16.7915 5.79433 16.5962 5.98959L16.5861 5.99968C15.9787 6.60711 15.0727 6.77651 14.2962 6.45448C13.5212 6.13311 13 5.37381 13 4.51426V4.5C13 4.22386 12.7761 4 12.5 4H11.5C11.2239 4 11 4.22386 11 4.5V4.51426C11 5.37381 10.4788 6.13311 9.70384 6.45448C8.92725 6.77651 8.02132 6.60711 7.41389 5.99968L7.40381 5.98959C7.20854 5.79433 6.89196 5.79433 6.6967 5.98959L5.98959 6.6967C5.79433 6.89196 5.79433 7.20854 5.98959 7.40381L5.99967 7.41389C6.60711 8.02132 6.77651 8.92727 6.45448 9.70385C6.13311 10.4788 5.37382 11 4.51426 11H4.5C4.22386 11 4 11.2239 4 11.5V12.5C4 12.7761 4.22386 13 4.5 13H4.51426C5.37382 13 6.13311 13.5212 6.45447 14.2961C6.77651 15.0727 6.60711 15.9787 5.99968 16.5861L5.98959 16.5962C5.79433 16.7915 5.79433 17.108 5.98959 17.3033L6.6967 18.0104C6.89196 18.2057 7.20854 18.2057 7.4038 18.0104L7.41389 18.0003C8.02132 17.3929 8.92726 17.2235 9.70384 17.5455C10.4788 17.8669 11 18.6262 11 19.4857V19.5Z" fill="white" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="white" />
                                </svg>
                            </div>
                        </div>
                        <div className='px-24 pt-8 pb-12' style={{ borderBottom: 'solid 1px gray' }}>
                            <IOSSlider
                                defaultValue={25}
                                marks={marks}
                                step={25}
                            />
                        </div>
                        <div className='flex flex-col px-24 pt-10 pb-4 text-white'>
                            <div className='flex w-full justify-between'>
                                <p>Estimated Fee</p>
                                <div>-</div>
                            </div>
                            <div className='flex w-full justify-between'>
                                <p>Min. MAV</p>
                                <div>-</div>
                            </div>
                        </div>
                        <div className='mx-8 mb-4 px-4 py-2 rounded-xl bg-white flex items-center justify-between'>
                            <p></p>
                            Deposit
                            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 7H21M21 7L15 1M21 7L15 13" stroke="#191C23" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div className='w-1/2 rounded-2xl bg-[#040404]'>
                        <div className='bg-[#141414] rounded-2xl m-1'>
                            <img alt="#" className='absolute' src={E5} style={{ right: '0px' }} />
                            <img alt="#" className='absolute' src={E6} style={{ right: '0px' }} />
                            <img alt="#" className='absolute' src={E7} style={{ right: '0px' }} />
                            <img alt="#" className='absolute' src={E8} style={{ right: '0px' }} />
                            <div className='text-center text-white py-12'>FAQ</div>
                        </div>
                        <Accordion data={faq} />
                    </div>
                </div>
                <img alt="#" className='m-auto pt-4 relative' width={20} src={headerLeft} />
                <div className='w-full flex place-content-center pt-[14px] relative'>
                    <div className='bg-white' style={{ bottom: '-3px', width: '100px', height: '2px', boxShadow: '0px -13px 40px 7px' }} />
                </div>
            </div>
            <div className='relative'>
                <div className='absolute z-10 w-full flex flex-col items-center'>
                    <p className='text-white pt-16 text-[48px]'>Join the Rogue Community</p>
                    <p className='text-gray-500 text-[18px]'>Our Discord and Twitter are the best places to stay up to date on all of Rogue's latest developments.</p>
                    <div className='flex text-white pt-12'>
                        <div className='flex rounded-[40px] items-center place-content-center gap-4 py-4 w-[300px]' style={{ border: 'solid 1px gray' }}>
                            <img alt="#" src={ITwi} />
                            <p>Follow on Twitter</p>
                        </div>
                        <div className='flex rounded-[40px] items-center place-content-center gap-4 py-4 w-[300px]' style={{ border: 'solid 1px gray' }}>
                            <img alt="#" src={IDis} />
                            <p>Join our Discord</p>
                        </div>
                        <div className='flex rounded-[40px] items-center place-content-center gap-4 py-4 w-[300px]' style={{ border: 'solid 1px gray' }}>
                            <img alt="#" src={IMir} />
                            <p>Read more Mirror</p>
                        </div>
                    </div>
                </div>
                <img alt="#" className='relative w-full px-2' style={{ top: '-20px' }} src={Community} />
            </div>
            <div className='flex justify-between px-12 py-8 text-white'>
                <div className='flex gap-4 items-center'>
                    <img src={headerLeft} />
                    <p className='text-4xl'>Rogue</p>
                </div>
                <div className='flex gap-6'>
                    <div className='text-2xl'>Twitter</div>
                    <div className='text-2xl'>Discord</div>
                    <div className='text-2xl'>Blog</div>
                    <div className='text-2xl'>Docs</div>
                </div>
            </div>
        </div>
    )
}

export default Home