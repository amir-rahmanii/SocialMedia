
import { ArrowDropDownIcon } from '@mui/x-date-pickers'

type BoxHomeProps = {
  title: string,
  count: number,
  growth: number,
  svg : any
}

function BoxHome(props: BoxHomeProps) {
  return (
    <div className='py-6 rounded-sm px-[30px] bg-admin-navy'>
      {/* icon */}
      <div className='bg-[#313D4A] w-[46px] h-[46px] rounded-full flex items-center justify-center'>
        <div className='w-5 h-5'>
          {props.svg}
        </div>
      </div>

      {/* number */}
      <div className='mt-4 flex flex-col gap-1'>
        <p className='font-bold text-2xl/[30px] font-sans'>{props.count?.toLocaleString()}</p>
        <div className='text-sm flex justify-between items-center'>
          <p className='text-admin-High'>Total {props.title}</p>
          <div className={`${props.growth > 0 ? "text-admin-plus" : "text-admin-minus"} flex`}>{props.growth.toFixed(2)} %
            <div className={`${props.growth > 0 ? "rotate-180" : "rotate-0"}`}>
              <ArrowDropDownIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoxHome