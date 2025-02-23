export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Cicilia Import</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">מי אנחנו</h2>
            <p className="text-gray-600 leading-relaxed">
              Cicilia Import היא בית למצוינות קולינרית, המובילה את תרבות הגסטרונומיה האיטלקית בישראל. מאז היווסדה בשנת 2018, החברה מתמחה בייבוא ושיווק מוצרי פרימיום איטלקיים, הנבחרים בקפידה ממיטב היצרנים והמותגים הידועים באיטליה.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">החזון שלנו</h2>
            <p className="text-gray-600 leading-relaxed">
              אנו מחויבים לאיכות חסרת פשרות, לאותנטיות ולמסורת איטלקית עשירה, תוך התאמה לקהל הישראלי. Cicilia Import מפיצה את מוצריה למגוון רחב של לקוחות, בהם מסעדות שף, מלונות יוקרה, מעדניות בוטיק, וחובבי קולינריה אניני טעם.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">המוצרים שלנו</h2>
            <p className="text-gray-600 leading-relaxed">
              המוצרים שלנו מספרים סיפור של אומנות, מסורת וחדשנות – ומביאים את איטליה, בטעמה המשובח ביותר, הישר אליכם.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">הערכים שלנו</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium">איכות</h3>
                <p className="text-gray-600">
                  מחויבות לאיכות חסרת פשרות במוצרי פרימיום איטלקיים
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">אותנטיות</h3>
                <p className="text-gray-600">
                  שמירה על המסורת האיטלקית העשירה והמקורית
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">מצוינות</h3>
                <p className="text-gray-600">
                  בחירה קפדנית של המותגים והיצרנים המובילים באיטליה
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">חדשנות</h3>
                <p className="text-gray-600">
                  התאמה מושלמת בין המסורת האיטלקית לטעם הישראלי
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 