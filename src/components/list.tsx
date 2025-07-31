import type { TransactionListProps } from "@/lib/types"


const List: React.FC<TransactionListProps> = ({ data }) => {

    if (data.length === 0) return null;

    return (
        <div className="space-y-2">
      {data.map((tx, idx) => {
        const isIn = tx.tag === "in";
        const sign = isIn ? "+" : "−"; // U+2212 minus
        const colorClass = isIn ? "text-green-500" : "text-red-500";

        return (
          <div
            key={idx}
            className="flex justify-between items-center p-2 border-b border-gray-300 transition-colors"
          >
            <div className="flex flex-col">
              <span className="font-medium text-lg">{tx.title}</span>
              <span className="text-sm text-gray-500">
                {new Date(tx.date).toLocaleDateString()}
              </span>
            </div>
            <div className={`font-semibold ${colorClass}`}>
              {sign}&#8358;{tx.amount.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
    )
}

export default List;

