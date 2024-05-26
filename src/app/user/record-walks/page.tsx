'use client';

import UserRecordWalk from './UserRecordWalk';

function RecordWalks() {
  return (
    <section id='record-walks' className='flex flex-col items-center'>
      <div className='container'>
        <h1 className='overflow-hidden absolute w-0 h-0 leading-0 indent-[-99999px]'>산책 일지</h1>

        <UserRecordWalk />
      </div>
    </section>
  );
}

export default RecordWalks;
