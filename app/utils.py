import pandas as pd
from fastapi import UploadFile


def parse_file(file: UploadFile):
    """Parse CSV or Excel file and return list of employee dicts."""
    contents = file.file.read()
    file.file.seek(0)
    if file.filename.endswith('.csv'):
        df = pd.read_csv(file.file)
    else:
        df = pd.read_excel(file.file)
    df.columns = [c.lower().strip().replace(' ', '_') for c in df.columns]
    employees = df.to_dict(orient='records')
    return employees
