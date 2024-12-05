import { useState, useEffect } from 'react';
import { Timetable } from './TimeTable.tsx';
import { schedule } from './data.ts';

type CourseDetails = {
  course: {
    subject_code: string;
    units_per_class: number;
    type: string;
    category: string;
    restrictions: {
      F: any[];
      M: any[];
      S: any[];
      T: any[];
      W: any[];
      TH: any[];
    };
    course_id: string;
    total_units: number;
    gap: any[];
  };
  prof: {
    // Add properties relevant to the professor here
  };
  room: {
    // Add properties relevant to the room here
  };
  timeBlock: {
    // Add properties relevant to the time block here
  };
};

type TimetableData = {
  cs_1st: {
    cs_1a?: { M: CourseDetails[] }[]; // Define the nested structure more precisely
    cs_1b?: { M: CourseDetails[] }[];
  }[]; 
  it_1st: {
    it_1a?: CourseDetails[];
    it_1b?: CourseDetails[];
  }[];
  is_1st: {
    is_1a?: CourseDetails[];
    is_1b?: CourseDetails[];
  }[];
};

const timetableData: any = schedule;

const CSA = () => {
  if (timetableData == null || timetableData.length < 1) {
    return <></>;
  }

  const [current, setCurrent] = useState('cs_1a');
  const [data, setData] = useState<any>(timetableData[0]?.cs_1st[0]?.cs_1a ?? []);

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
      <div className='flex w-full justify-between'>
        {/* <button onClick={() => getPrevious(current)}>
          <p className='hover:text-blue-500'>Previous</p>
        </button> */}
        <a href='/csa' className='hover:text-blue-500'>Previous</a>
        {/* <button onClick={() => getNext(current)}>
          <p className='hover:text-blue-500'>Next</p>
        </button> */}
        <a href='/csb' className='hover:text-blue-500'>Next</a>
      </div>
    </div>
  );
};

export default CSA;
