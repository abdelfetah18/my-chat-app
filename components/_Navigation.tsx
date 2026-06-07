import NavigationItem from './NavigationItem';

export default function _Navigation({ page }) {
    return (
        <div className='flex flex-col justify-center w-1/6'>
            <div className='flex flex-col w-full items-center'>
                <NavigationItem icon={'lucide:log-in'} text='Sign In' page={page} destination='/sign_in' />
                <NavigationItem icon={'lucide:user-plus'} text='Sign Up' page={page} destination='/sign_up' />
            </div>
        </div>
    )
}
