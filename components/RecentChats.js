import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function RecentChats({ User, my_chats, setMyChats }){
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let [search_q,setSearchQ] = useState("");

    useEffect(() => {
      if(search_q.length > 0){
        searchChats();
      }else{
        updateChats();
      }
    },[search_q]);

    function updateChats(){
      axios.get('/api/v1/user/chats',{
        headers:{
          authorization:User.access_token
        }
      }).then((response) => {
        if(response.data.status == 'success'){
          setMyChats(response.data.data);
        }
      });
    }

    function searchChats(){
      axios.get('/api/v1/chat_search?username='+search_q,{
        headers:{
          authorization:User.access_token
        }
      }).then((response) => {
        if(response.data.status == 'success'){
          setMyChats(response.data.data);
        }
      });
    }
    
    return(
        <div className='md:w-1/6 lg:flex md:flex hidden flex-col lg:w-2/6 items-center'>
                <div className='md:hidden my-2 lg:flex flex-row w-5/6 bg-[#fafbff] items-center px-4 py-2 rounded-xl'>
                  <input className='w-11/12 font-mono text-xl bg-transparent px-4' value={search_q} onChange={(evt) => setSearchQ(evt.target.value)} placeholder='Search' />
                  <FaSearch className='w-1/12 text-[#c8cee5]' />
                </div>
    
                {
                  my_chats.map((c,i) => {
                    function calcTime(timestamp,diveder){
                      return[Math.floor(timestamp/diveder),timestamp % diveder];
                    }
                    let time_ago = (c.message != null) ? Date.now() - (new Date(c.message.created_at || c.message._createdAt)) : 0;
                    let [days,r_days] = calcTime(time_ago,1000*60*60*24);
                    let [hours,r_hours] = calcTime(r_days,1000*60*60);
                    let [minutes,r_minutes] = calcTime(r_hours,1000*60);
                    let [seconds,mileseconds] = calcTime(r_minutes,1000);

                    function getLastMessage(){
                      if(!c.message)
                        return "";
                      return c.message.user._id == User._id ? 'you: '+(c.message.message_type === "text" ? c.message.message_content : 'send a '+c.message.message_type) : c.message.user.username+": "+(c.message.message_type === "text" ? c.message.message_content : 'send a '+c.message.message_type);
                    }

                    return(
                      <div key={i} onClick={() => window.location.href = '/chat/'+c.chat_id } className='md:w-fit hover:shadow-xl cursor-pointer my-2 flex flex-row lg:w-5/6 bg-[#fafbff] items-center px-4 py-2 rounded-xl'>
                        <div className='w-14'>
                          <img className='object-cover w-14 h-14 rounded-full border-white border-[3px]' src={c.profile_image != null ? c.profile_image : '/profile.jpeg'} />
                        </div>
                        <div className='lg:flex flex-col flex-grow md:hidden'>
                          <div className='w-full text-end font-mono text-xs font-semibold text-[#a2aac1]'>{(c.message != null) ? ((days > 1) ? ((new Date(c.message._createdAt)).getDate().toString()+' '+months[(new Date(c.message.created_at || c.message._createdAt)).getMonth()]) : (hours != 0 ? hours.toString()+' hours' : minutes.toString()+' minutes' )) : ''}</div>
                          <div className='flex flex-row w-full'>
                            <div className='flex flex-col w-11/12 px-2'>
                              <div className='font-mono text-base font-bold text-[#020762]'>{c.username || c.name}</div>
                              <div className='font-mono text-xs font-medium text-[#b7bfcc] text-ellipsis w-full'>{getLastMessage()}</div>
                            </div>
                            {/* TODO: unread messages counter, not available because unread state is not implemented! */}
                            <div className='hidden items-center justify-center w-1/12'>
                              <div className='font-mono bg-[#fd476f] rounded-full h-4 w-4 text-center text-xs text-white'>5</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
    
            </div>
    )
}