import { useAppContext } from '../../context/AppContext'

const ChangeTerm = () => {

    const {semester, changeSemester} = useAppContext()

    console.log(semester)

    const handleChoose = (term: number) => {
        if (term == 1){
            changeSemester("First Semester")
            console.log("sem set")
        }else{
            changeSemester("Second Semester")
        }
    }

  return (
    <div className='w-full flex justify-center h-[600px] items-center'>
        <div className="bg-[rgba(241,250,255,0.5)] rounded-xl shadow-[0px_2px_8px_0px_rgba(30,30,30,0.25)] p-7 w-full lg:w-6/12 flex flex-col justify-center gap-y-4 h-auto">
            <h1 className='font-bold text-primary text-lg'>Choose an academic term:</h1>
            <div className='w-full flex gap-x-4 justify-center'>
                <button onClick={() => handleChoose(1)} className={`rounded-md flex justify-center font-semibold w-full py-3 hover:bg-primary hover:text-white ${semester === 'First Semester' ? 'bg-primary text-white' : 'bg-white'}`}>First Term</button>
                <button onClick={() => handleChoose(2)} className={`rounded-md flex justify-center font-semibold w-full py-3 hover:bg-primary hover:text-white ${semester === 'Second Semester' ? 'bg-primary text-white' : 'bg-white'}`}>Second Term</button>
            </div>
        </div>
    </div>
  )
}

export default ChangeTerm