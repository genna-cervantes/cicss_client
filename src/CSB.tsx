import { useState, useEffect } from 'react';
import { Timetable } from './TimeTable.tsx';
import { schedule } from './data.ts';


const timetableData: any = schedule;

const CSB = () => {
  if (timetableData == null || timetableData.length < 1) {
    return <></>;
  }

  console.log('csb')

  const [current, setCurrent] = useState('cs_1b');
  const [data, setData] = useState<any>(timetableData[0]?.cs_1st[1]?.cs_1b ?? []);
  console.log(data)
  console.log(timetableData[0].cs_1st[1].cs_1b)

  const getNext = (current: any) => {
    switch (current) {
      case 'cs_1a':
        setData(timetableData[0]?.cs_1st[0]?.cs_1b);
        console.log('hello')
        console.log(data)
        setCurrent('cs_1b');
        break;
      case 'cs_1b':
        setData(timetableData[0]?.it_1st[0]?.it_1a);
        console.log('hello')
        setCurrent('it_1a');
        break;
      case 'it_1a':
        setData(timetableData[0]?.it_1st[0]?.it_1b);
        setCurrent('it_1b');
        break;
      case 'it_1b':
        setData(timetableData[0]?.is_1st[0]?.is_1a);
        setCurrent('is_1a');
        break;
      case 'is_1a':
        setData(timetableData[0]?.is_1st[0]?.is_1b);
        setCurrent('is_1b');
        break;
      case 'is_1b':
        setData(timetableData[0]?.cs_1st[0]?.cs_1a);
        setCurrent('cs_1a');
        break;
    }
    console.log(data) 
  };

  console.log(data)

  const getPrevious = (current: any) => {
    switch (current) {
      case 'cs_1a':
        setData(timetableData[0]?.it_1b ?? []);
        setCurrent('it_1b');
        break;
      case 'cs_1b':
        setData(timetableData[0]?.cs_1a ?? []);
        setCurrent('cs_1a');
        break;
      case 'it_1a':
        setData(timetableData[0]?.cs_1b ?? []);
        setCurrent('cs_1b');
        break;
      case 'it_1b':
        setData(timetableData[0]?.it_1a ?? []);
        setCurrent('it_1a');
        break;
      case 'is_1a':
        setData(timetableData[0]?.it_1b ?? []);
        setCurrent('it_1b');
        break;
      case 'is_1b':
        setData(timetableData[0]?.is_1a ?? []);
        setCurrent('is_1a');
        break;
    }
  };

  // Log data when it changes
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className='mx-10 my-10 flex flex-col justify-between h-[600px]'>
      <div>
        <h1 className='font-bold text-xl'>{current}</h1>
        <Timetable data={data} />
      </div>
      {/* <div className='flex w-full justify-between'>
        <button onClick={() => getPrevious(current)}>
          <p className='hover:text-blue-500'>Previous</p>
        </button>
        <button onClick={() => getNext(current)}>
          <p className='hover:text-blue-500'>Next</p>
        </button>
      </div> */}
    </div>
  );
};

export default CSB;
