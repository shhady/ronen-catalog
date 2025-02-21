export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">אודות</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">מי אנחנו</h2>
            <p className="text-gray-600 leading-relaxed">
              אנחנו חברה מובילה בתחום המזון והמשקאות, המתמחה באספקת מוצרים איכותיים ממיטב המותגים בעולם.
              החברה שלנו הוקמה מתוך חזון לספק את המוצרים הטובים ביותר ללקוחותינו, תוך שמירה על סטנדרטים
              גבוהים של איכות ושירות.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">החזון שלנו</h2>
            <p className="text-gray-600 leading-relaxed">
              החזון שלנו הוא להיות החברה המובילה בתחום, המספקת את המוצרים האיכותיים ביותר ללקוחותינו.
              אנו מאמינים במתן שירות מקצועי, אמין ואדיב, תוך שמירה על קשר אישי עם כל לקוח ולקוח.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">הערכים שלנו</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium">איכות</h3>
                <p className="text-gray-600">
                  אנו מקפידים על איכות בלתי מתפשרת בכל המוצרים שלנו
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">אמינות</h3>
                <p className="text-gray-600">
                  אנו מחויבים לאמינות מלאה בכל היבט של פעילותנו
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">שירות</h3>
                <p className="text-gray-600">
                  אנו מאמינים במתן שירות מקצועי ואדיב ללקוחותינו
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">חדשנות</h3>
                <p className="text-gray-600">
                  אנו תמיד מחפשים דרכים חדשות לשפר ולהתקדם
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 