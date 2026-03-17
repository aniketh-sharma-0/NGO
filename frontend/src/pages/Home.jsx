import React from 'react';
import { CarouselSection, SummarySection, FieldsOfWork, MembersSection } from '../components/home/HomeSections';

import SEO from '../components/common/SEO';

const Home = () => {
    return (
        <div className="homepage">
            <SEO
                title="Home"
                description="Welcome to Yaswanth Rural Development Society. Empowering communities through education, healthcare, and sustainable development."
                keywords="NGO, Rural Development, Education, Healthcare, Social Work"
            />
            <CarouselSection />
            <SummarySection />
            <FieldsOfWork />
            <MembersSection />
        </div>
    );
};

export default Home;
