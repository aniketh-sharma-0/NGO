import React from 'react';
import CarouselSection from '../components/home/CarouselSection';
import SummarySection from '../components/home/SummarySection';
import FieldsOfWork from '../components/home/FieldsOfWork';
import MembersSection from '../components/home/MembersSection';

const Home = () => {
    return (
        <div className="homepage">
            <CarouselSection />
            <SummarySection />
            <FieldsOfWork />
            <MembersSection />
        </div>
    );
};

export default Home;
