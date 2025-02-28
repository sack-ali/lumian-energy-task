"use client";  

import React, { useEffect, useState } from "react";
import { fetchData } from "../lib/fetchData";
import { Facility } from "../lib/types";


const Table: React.FC = () => {
    const [data, setData] = useState<Facility[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [lastFetchTime, setLastFetchTime] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [language, setLanguage] = useState<"en" | "tr">("en");

    const itemsPerPage = 10;

    useEffect(() => {
        loadTableData();
    }, [language]);

   
    const loadTableData = async () => {
        const now = Date.now();
        if (now - lastFetchTime < 5000) {
            alert("Please wait at least 5 seconds before refreshing again.");
            return;
        }

        setLoading(true);
        try {
            const result = await fetchData();
            console.log("API Fetched Data:", result);

            if (result && result.result && result.result.values) {
                setData(result.result.values);
                setLastFetchTime(now);
            } else {
                console.error("Unexpected API response structure:", result);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

  
    const handleSort = (columnId: string) => {
        if (sortColumn === columnId) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(columnId);
            setSortOrder("asc");
        }
    };

   
    const translations = {
        en: {
            name: "Name",
            distributionCompanyName: "Distribution Company",
            createdAt: "Created At",
            updatedAt: "Updated At"
        },
        tr: {
            name: "İsim",
            distributionCompanyName: "Dağıtım Şirketi",
            createdAt: "Oluşturma Tarihi",
            updatedAt: "Güncellenme Tarihi"
        }
    };

    const translatedColumns = [
        { key: "name", label: translations[language].name },
        { key: "distributionCompanyName", label: translations[language].distributionCompanyName },
        { key: "createdAt", label: translations[language].createdAt },
        { key: "updatedAt", label: translations[language].updatedAt }
    ];

    
    const filteredData = data.filter((row) =>
        translatedColumns.some((col) =>
            (row as any)[col.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn) return 0;
        
        const valueA = (a as any)[sortColumn]?.toString().toLowerCase();
        const valueB = (b as any)[sortColumn]?.toString().toLowerCase();

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

   
    const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="table-container">
            <div className="controls">
                
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-box"
                />
                <button className="refresh-btn" onClick={loadTableData}>Refresh</button>
            </div>

            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : (
                <table className="styled-table">
                    <thead>
                        <tr>
                            {translatedColumns.map((col) => (
                                <th key={col.key} onClick={() => handleSort(col.key)} className="sortable">
                                    {col.label} {sortColumn === col.key ? (sortOrder === "asc" ? "🔼" : "🔽") : ""}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row) => (
                                <tr key={row.id}>
                                    {translatedColumns.map((col) => (
                                        <td key={col.key}>{(row as any)[col.key]}</td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={translatedColumns.length} className="no-data">No Data Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                <span>Page {page}</span>
                <button disabled={data.length <= page * itemsPerPage} onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </div>
    );
};

export default Table;
