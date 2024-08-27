import { getKey } from '@/api/test'

export default function Test() {

    useEffect(()=>{
        getKey('name')
    },undefined)

    return (
        <div>
            <h1>Test</h1>
        </div>
    )
}