import Image from 'next/image';

export const ReviewStepFinished = ({ teamId }: { teamId: number }) => {
  return (
    <div className="p-8 flex flex-col h-full">
      <h1 className="font-semibold text-2xl text-center">WhoopWhoop! Bedankt voor je review</h1>
      <div className="mt-12 -mx-4 rounded-lg">
        {teamId !== 1 && teamId !== 2 && (
          <Image
            className="rounded-lg"
            src="/images/party1.gif"
            width={480}
            height={340}
            layout="responsive"
            alt="Yeah"
          />
        )}
        {teamId === 1 && (
          <Image
            className="rounded-lg"
            src="/images/party2.gif"
            width={320}
            height={240}
            layout="responsive"
            alt="Yeah"
          />
        )}
        {teamId === 2 && (
          <Image
            className="rounded-lg"
            src="/images/party3.gif"
            width={480}
            height={270}
            layout="responsive"
            alt="Yeah"
          />
        )}
      </div>
      <p className="mt-auto pb-8 text-white text-opacity-60 text-center">
        Als je de volgende ronde weer mag meestemmen zie ik je straks weer!
      </p>
    </div>
  );
};
