
import React from 'react';
import { useState } from 'react';

const Accordion = (props) => {
    const [index, setIndex] = useState(0);
    return (
        <div className='relative'>
            {props.data.map((item, ind) => (
                <div key={ind}>
                    <h2>
                        <div onClick={() => setIndex(ind)} className="flex items-center cursor-pointer justify-between w-full px-5 pt-8 font-medium text-left text-gray-500 focus:ring-4 focus:ring-gray-200">
                            <span className='text-white'>{item.title}</span>
                            <div className='rounded-[50%] p-2' style={{ border: 'solid 1px gray' }}>
                                {index === ind ?
                                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 9L9 1M9 1H1M9 1V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg> :
                                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L9 9M9 9L9 1M9 9L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                }
                            </div>
                        </div>
                    </h2>
                    <div >
                        <div className="text-gray-400 px-5 pt-2 pb-8">
                            {
                                index === ind ?
                                    item.body.split('\n').map((text, index) => (
                                        <React.Fragment key={index}>
                                            {index !== 0 ? <br /> : <></>}
                                            {text}
                                        </React.Fragment>
                                    )) : item.sm.split('\n').map((text, index) => (
                                        <React.Fragment key={index}>
                                            {index !== 0 ? <br /> : <></>}
                                            {text}
                                        </React.Fragment>
                                    ))
                            }
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Accordion;